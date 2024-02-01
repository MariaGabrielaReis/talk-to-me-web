type ButtonProps = { title: string; type?: "submit" | "button" };

export default function Button({ title, type = "submit" }: ButtonProps) {
  return (
    <button className="bg-cyan w-full rounded-md py-2" type={type}>
      <span>{title}</span>
    </button>
  );
}
