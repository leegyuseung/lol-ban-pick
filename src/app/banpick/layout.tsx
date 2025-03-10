function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center">
      <div className="w-3/5 h-[70vh]  items-center bg-black border-l-pink-500  overflow-y-auto">{children}</div>
    </div>
  );
}

export default layout;
