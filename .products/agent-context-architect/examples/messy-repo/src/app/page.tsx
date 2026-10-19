import { formatPrice } from '../lib/format';

const products = [
  { id: 'tee', name: 'Cotton Tee', priceCents: 2400 },
  { id: 'cap', name: 'Field Cap', priceCents: 1800 },
];

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Acme Storefront</h1>
      <ul className="mt-4 space-y-2">
        {products.map((product) => (
          <li key={product.id}>
            {product.name} — {formatPrice(product.priceCents)}
          </li>
        ))}
      </ul>
    </main>
  );
}
