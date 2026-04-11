const CardBody = ({ icon, title, total, style }) => {
  return (
    <article className="w-full rounded-2xl border border-emerald-100 bg-white/90 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-4 p-4 md:p-5">
        <div
          className="h-14 w-14 rounded-xl flex items-center justify-center shadow-sm"
          style={style || { backgroundColor: "#0f766e" }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-500 truncate">
            {title}
          </h2>
          <p className="text-2xl font-bold text-slate-900 truncate">{total}</p>
        </div>
      </div>
    </article>
  );
};

export default CardBody;
