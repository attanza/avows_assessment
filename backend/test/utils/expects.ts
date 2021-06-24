export function unauthorizedExpect(body: any): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(401);
  expect(body.meta.message).toEqual('Unauthorized');
}

export function forbiddenExpect(body: any): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(403);
  expect(body.meta.message).toEqual('Forbidden resource');
}

export function resourceListExpects(body: any): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(200);
  expect(body.meta.hasNextPage).toBeDefined();
  expect(body.meta.hasPrevPage).toBeDefined();
  expect(body.meta.page).toBeDefined();
  expect(body.meta.limit).toBeDefined();
  expect(body.meta.totalPages).toBeDefined();
  expect(body.meta.totalDocs).toBeDefined();
  expect(body.data).toBeDefined();
  expect(Array.isArray(body.data)).toBeTruthy();
}

export function keysExpect(data: any, keys: string) {
  keys.split(' ').map((key) => {
    expect(data[key]).toBeDefined();
  });
}

export function validationFailedExpect(body: any, errMessage: string): void {
  expect(body).toBeDefined();
  expect(Array.isArray(body.message)).toBeTruthy();
  expect(body.message.includes(errMessage)).toBeTruthy();
}

export function duplicateErrorExpect(body: any, field: string): void {
  const errMessage = `${field} already exists`;
  expect(body.message).toEqual(errMessage);
}

export function generalErrorExpect(body: any, errMessage: string): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(400);
  expect(body.meta.message).toEqual(errMessage);
}

export function showExpect<T>(body: any, resource: string): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(200);
  expect(body.meta.message).toEqual(`${resource} item retrieved`);
  expect(body.data).toBeDefined();
}

export function updateExpect<T>(body: any, resource: string): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(200);
  expect(body.meta.message).toEqual(`${resource} updated`);
  expect(body.data).toBeDefined();
}

export function deleteExpect<T>(body: any, resource: string): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(200);
  expect(body.meta.message).toEqual(`${resource} deleted`);
}
