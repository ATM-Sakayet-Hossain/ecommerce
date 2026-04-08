const CardBody = ({ icon, title, total, style }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg flex items-center justify-center gap-5 overflow-hidden">
      <div className="p-5 flex items-center justify-center" style={style}>
        {icon}
      </div>
      <div className="w-full">
        <h2 className="text-xl font-semibold text-start">{title}</h2>
        <p className="text-xl font-semibold text-start">{total}</p>
      </div>
    </div>
  );
};

export default CardBody;