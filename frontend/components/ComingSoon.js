import Link from "next/link";

export default function ComingSoon({ title }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 pt-20">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-5xl">{title}</h1>
        <p className="mt-4 text-gray-500">Ye page jaldi aa raha hai.</p>
        <Link
          href="/hotels"
          className="mt-8 inline-block rounded-full bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700"
        >
          Hotels dekho
        </Link>
      </div>
    </main>
  );
}