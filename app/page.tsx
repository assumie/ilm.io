import { redirect } from 'next/navigation';

/*
 * Students land straight on their lessons. No marketing page in the way.
 * The product overview lives at /about.
 */
export default function Home() {
  redirect('/learn');
}
