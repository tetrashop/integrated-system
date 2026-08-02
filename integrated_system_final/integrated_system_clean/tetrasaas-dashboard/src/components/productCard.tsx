import { Link } from 'react-router-dom';
import { Product } from '../types/product';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-4 flex flex-col items-center text-center"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-40 h-40 object-cover rounded-xl mb-4"
      />
      <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{product.description}</p>
      <span className="text-xl font-bold text-emerald-600">
        {product.price.toLocaleString()} تومان
      </span>
    </Link>
  );
}
