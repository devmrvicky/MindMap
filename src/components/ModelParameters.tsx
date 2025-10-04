export function ModelParameters({ parameters }: { parameters: string[] }) {
  return (
    <div className="flex flex-row gap-2 items-center flex-wrap py-2">
      {parameters.map((parameter) => (
        <span className="rounded-full border border-muted px-2 py-1 text-sm text-zinc-400">
          {parameter}
        </span>
      ))}
    </div>
  );
}
