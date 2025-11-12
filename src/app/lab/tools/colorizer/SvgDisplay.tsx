// src/app/lab/tools/colorizer/SvgDisplay.tsx
import IllustrationPreview from './IllustrationPreview';

export default function SvgDisplay({
  colors,
  bgColor,
  id,
}: {
  colors: string[];
  bgColor: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="border p-2 flex justify-center items-center"
      style={{
        height: '70vh',
        margin: '0 auto',
        backgroundColor: bgColor,
      }}
    >
      <IllustrationPreview colors={colors} />
    </div>
  );
}

