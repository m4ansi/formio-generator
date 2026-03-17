import image_6189588d117d5c4539389216af430baa756553b2 from 'figma:asset/6189588d117d5c4539389216af430baa756553b2.png'
import logoImage from 'figma:asset/e121e9f9afa149dc3aa255a6b66702c4cf52d24b.png';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-[18px] py-[6px]">
      <div className="flex items-center gap-1">
        <img src={image_6189588d117d5c4539389216af430baa756553b2} alt="BoomerangFX" className="w-[12vw] h-auto rounded-[16px] mx-[0px] my-[-20px]" />
        <span className="text-gray-500 text-sm">Form Builder</span>
      </div>
    </header>
  );
}