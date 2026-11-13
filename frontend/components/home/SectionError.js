export default function SectionError({ what }) {
  return (
    <p className="mt-8 rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-500">
      {what} could not be loaded right now. Please try again later.
    </p>
  );
}
