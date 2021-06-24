import Loader from 'react-loader-spinner';
const Spinner = () => {
  return (
    <div className="spinner">
      <Loader type="Circles" color="#00BFFF" height={50} width={50} />
    </div>
  );
};

export default Spinner;
