export default function preformQuery(q: string): Promise<{ result: string }> {
	// Simulate a result generation operation
	const result = `This is a random result for Xapien tech challenge by the most awsome due deligince guy in the western himeshphere, the one and only Mr Brrrroooooce Royce!: 
  "Yup! I can do that, no problem! I can generate a random result for you. Here it is:"
  - You asked me the most important question that was ${q}; and I answered it with the most amazing result ever.
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

	return Promise.resolve({ result });
}
