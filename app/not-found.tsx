import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center text-center p-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
        <p className="text-gray-600 dark:text-gray-300">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link href="/" className="inline-block mt-8 text-blue-600 hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
