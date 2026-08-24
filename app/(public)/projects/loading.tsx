export default function ProjectsLoading() {
  return (
    <>
      <div className="border-b-[3px] border-black bg-white px-6 sm:px-10 py-10">
        <div className="h-4 w-32 bg-black/10 animate-pulse mb-4" />
        <div className="h-14 w-72 bg-black/15 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 sm:p-10 border-b-[3px] border-black bg-white">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-[3px] border-black h-64 animate-pulse bg-[color:var(--color-off-white)]" />
        ))}
      </div>
    </>
  )
}
