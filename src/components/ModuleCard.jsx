export default function ModuleCard({mod, onOpen}) {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h3 className="card-title">{mod.title}</h3>
        <p>{mod.description}</p>
        <div className="flex gap-2 my-2">
          {mod.tags?.map(t => <span key={t} className="badge badge-outline">{t}</span>)}
        </div>
        <div className="card-actions justify-end">
          <button onClick={onOpen} className="btn btn-primary btn-sm">Open</button>
        </div>
      </div>
    </div>
  );
}
