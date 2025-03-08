function layout({
  children,
  banpick,
}: Readonly<{
  children: React.ReactNode;
  banpick: React.ReactNode;
}>) {
  return (
    <div className="flex align-middle">
      <div className="w-4/5 h-4/5 bg-black border-l-pink-500">{banpick}</div>
    </div>
  );
}

export default layout;
