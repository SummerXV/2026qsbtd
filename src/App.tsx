/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book } from './components/Book';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 overflow-hidden">
      <Book />
      
      <div className="mt-8 text-center opacity-60">
        <p className="font-hand text-lg text-gray-500">
          Tap the right page to go forward, left page to go back.
        </p>
      </div>
    </div>
  );
}
