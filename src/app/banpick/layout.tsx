function layout({
  children,
  selectChampions,
}: Readonly<{
  children: React.ReactNode;
  selectChampions: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center items-center">
      <div className="w-4/5 h-4/5 bg-black border-l-pink-500">{selectChampions}</div>
    </div>
  );
}

export default layout;
