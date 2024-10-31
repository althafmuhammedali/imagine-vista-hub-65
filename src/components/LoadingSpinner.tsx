export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <img
        src="https://i.pinimg.com/originals/cd/8a/2d/cd8a2df3534127f660734a9c2053b7b3.gif"
        alt="Loading..."
        className="w-32 h-32"
      />
    </div>
  );
}