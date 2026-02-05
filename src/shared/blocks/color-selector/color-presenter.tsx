import { ColorHex, ColorKey, ColorLabel } from '@/lib/types/inventory.types';
import AllImg from '@/assets/img/colors/all.png';
import WoodImg from '@/assets/img/colors/wood.png';
import WalnutImg from '@/assets/img/colors/walnut.png';

export default function ColorPresenter({ color }: { color: ColorKey }) {
  let bgImage = '';
  if (color === ColorKey.ALL) bgImage = AllImg.src;
  if (color === ColorKey.WOOD) bgImage = WoodImg.src;
  if (color === ColorKey.WALNUT) bgImage = WalnutImg.src;

  if (!color) return <p>Otro</p>;

  return (
    <div className='flex items-center gap-2'>
      <div
        className='h-5 w-5 overflow-hidden rounded-full border bg-white bg-cover bg-center'
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundColor: ColorHex[color],
          borderColor: color === ColorKey.WHITE ? 'black' : 'white',
        }}
      />
      <p>{ColorLabel[color]}</p>
    </div>
  );
}
