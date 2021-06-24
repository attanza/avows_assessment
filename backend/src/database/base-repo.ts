import { BadRequestException } from '@nestjs/common';
import crypto from 'crypto';
import { ESortMode, PaginationParams } from 'src/utils/paginationParams';
import { Redis } from 'src/utils/redis';
import {
  Between,
  Brackets,
  FindManyOptions,
  ILike,
  Not,
  ObjectLiteral,
  Repository,
} from 'typeorm';

abstract class BaseRepo<T> {
  private readonly dbModel: Repository<T>;
  constructor(model: Repository<T>) {
    this.dbModel = model;
  }

  /**
   * Read Data
   */

  async paginate(
    query: PaginationParams,
    searchableKeys = '',
    relations?: string[]
  ) {
    const redisKey =
      this.getModelName() +
      '_' +
      crypto.createHash('md5').update(JSON.stringify(query)).digest('hex');
    const cache = await Redis.get(redisKey);
    if (cache) {
      return cache;
    }
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const sortBy: any = query.sortBy || 'createdAt';
    const sortMode: any =
      query.sortMode && query.sortMode === ESortMode.ASC ? 'ASC' : 'DESC';
    const options: FindManyOptions<T> = {
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [sortBy]: sortMode,
      },
    };
    if (relations && relations.length > 0) {
      options.relations = relations;
    }

    let select: any[];
    if (query.select) {
      const selectSplit = query.select ? query.select.split(' ') : [];
      select = selectSplit.map((s) => s);
    }

    if (select && select.length > 0) {
      options.select = select;
    }

    let where: string | Brackets | ObjectLiteral | ObjectLiteral[] = {};
    if (query.fieldKey && query.fieldValue) {
      where = {};
      if (Array.isArray(query.fieldValue) && Array.isArray(query.fieldValue)) {
        let key: any;
        for (key in query.fieldKey) {
          where = { ...where, [query.fieldKey[key]]: query.fieldValue[key] };
        }
      } else {
        where = { ...where, [query.fieldKey]: query.fieldValue };
      }
    }

    if (query.regexKey && query.regexValue) {
      where = { [query.regexKey]: ILike(`%${query.regexValue}%`) };
    }

    if (query.between) {
      const betweenSplit = query.between.split(',');
      where = {
        ...where,
        [betweenSplit[0]]: Between(betweenSplit[1], betweenSplit[2]),
      };
    }

    if (query.search && searchableKeys.length > 0) {
      const searchWhere: any[] = [];
      searchableKeys
        .split(' ')
        .map((key) => searchWhere.push({ [key]: ILike(`%${query.search}%`) }));
      where = searchWhere;
    }

    if (Object.keys(where).length > 0) {
      options.where = where;
    }

    const total = await this.dbModel.count({ where });
    const docs = await this.dbModel.find(options);

    const totalPages = Math.ceil(total / limit);

    const pagination = {
      limit,
      page,
      totalPages,
      totalDocs: total,
      hasPrevPage: page > 1,
      hasNextPage: page === totalPages ? false : true,
      nextPage: page === totalPages ? null : page + 1,
      prevPage: page > 1 ? page - 1 : null,
      hasMore: page === totalPages ? false : true,
    };
    const output = { pagination, docs };
    if (this.shouldCache(query)) {
      await Redis.set(redisKey, output);
    }

    return output;
  }

  async find(condition: any): Promise<Array<T>> {
    return this.dbModel.find(condition);
  }

  async findOne(condition: any): Promise<T> {
    return this.dbModel.findOne(condition);
  }

  async show(id: string, relations?: string[]): Promise<T> {
    const conditions: any = { where: { id } };
    if (relations && relations.length > 0) {
      conditions['relations'] = relations;
    }

    const found = await this.findOne(conditions);

    if (!found) {
      throw new BadRequestException(`${this.dbModel.metadata.name} not found`);
    }
    return found;
  }

  /**
   * Create Data
   */

  async create<X>(data: X): Promise<T> {
    const newData = this.dbModel.create();
    this.dbModel.merge(newData, data);
    await Promise.all([
      this.dbModel.save(newData),
      Redis.deletePattern(this.getModelName()),
    ]);

    return newData;
  }

  async insertMany<X>(data: X) {
    return this.dbModel.createQueryBuilder().insert().values(data).execute();
  }

  /**
   * Update Data
   */

  async update<X>(id: string, data: X): Promise<T> {
    await Promise.all([
      this.dbModel.update(id, data),
      Redis.deletePattern(this.getModelName()),
    ]);
    const updated = await this.dbModel.findOne(id);
    if (updated) {
      return updated;
    }
    throw new BadRequestException(`${this.dbModel.metadata.name} not found`);
  }

  /**
   * Delete Data
   */

  async delete(id: string): Promise<void> {
    const found = await this.dbModel.findOne(id);
    if (!found) {
      throw new BadRequestException(`${this.dbModel.metadata.name} not found`);
    }
    await Promise.all([
      this.dbModel.delete(id),
      Redis.deletePattern(this.getModelName()),
    ]);
  }

  async deleteBy(condition: any) {
    await this.dbModel.delete(condition);
  }

  /**
   * Utils
   */

  async checkDuplicate(key: string, value: any, id?: string) {
    if (key && value) {
      const condition = {
        where: {
          [key]: value,
        },
      };

      if (id) {
        condition.where['id'] = Not(id);
      }
      const found = await this.dbModel.findOne(condition);
      if (found) {
        throw new BadRequestException(`${key} already exists`);
      }
    }
  }

  private getModelName(): string {
    return this.dbModel.metadata.name;
  }

  private shouldCache(ctx: PaginationParams): boolean {
    if (ctx.regexKey && ctx.regexValue) {
      return false;
    }
    if (ctx.search) {
      return false;
    }

    return true;
  }
}

export default BaseRepo;
