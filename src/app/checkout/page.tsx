import Link from "next/link";

export default async function CheckOut({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;

  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and check out when you're ready.",
    );
  }
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <div className="mx-auto min-h-screen max-w-[1150px] px-6">
        {/* Header */}
        <header className="flex items-center justify-between pt-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-3xl text-gray-400 hover:text-white">
              ←
            </Link>
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded bg-[#29292d] text-lg">
              ♙
            </div>
          </div>

          <span className="rounded bg-[#20252a] px-2 py-1 text-[10px] font-bold tracking-widest">
            SANDBOX
          </span>
        </header>

        {/* Checkout Layout */}
        <div className="grid grid-cols-1 gap-10 pb-24 pt-8 md:grid-cols-2 md:gap-[60px]">
          {/* Left Side */}
          <section>
            <p className="mb-4 text-xs font-bold tracking-wider text-gray-400">
              CHOOSE A CURRENCY:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                className="rounded-lg border-2 border-white bg-[#121214] px-4 py-4 text-left text-sm font-semibold"
                type="button"
              >
                🇧🇩 &nbsp; BDT 2,553.33
              </button>

              <button
                className="rounded-lg border border-[#303034] px-4 py-4 text-left text-sm font-semibold text-gray-400 hover:border-white"
                type="button"
              >
                🇺🇸 &nbsp; $20.00
              </button>
            </div>

            <p className="mt-3 text-xs italic text-gray-500">
              1 USD = 127.6665 BDT
            </p>

            <div className="my-7 border-t border-[#303034]" />

            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Hireloop Pro Plan</h2>
              <span className="text-base font-semibold">BDT 2,553.33</span>
            </div>

            <p className="mt-2 text-sm text-gray-400">Access to all features</p>
          </section>

          {/* Right Side */}
          <section>
            <form
              action="/api/checkout_sessions"
              method="POST"
              className="space-y-6"
            >
              {/* Link Payment */}
              <button
                type="button"
                className="flex h-[46px] w-full items-center justify-center gap-3 rounded-lg bg-[#00d477] font-semibold text-black hover:bg-[#00c76e]"
              >
                <span>●</span>
                <span className="text-lg">link</span>
                <span className="mx-1 h-5 border-l border-black/30" />
                <span className="rounded bg-[#5545ef] px-2 py-0.5 text-xs font-bold text-white">
                  VISA
                </span>
                <span className="text-sm">4242</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[#303034]" />
                <span className="text-xs font-semibold text-gray-500">OR</span>
                <div className="h-px flex-1 bg-[#303034]" />
              </div>

              {/* Contact */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">
                  Contact information
                </h3>

                <label className="mb-1 block text-xs text-gray-400">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  required
                  className="h-[46px] w-full rounded-lg border border-[#303034] bg-[#1c1c1e] px-4 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">Payment method</h3>

                <div className="overflow-hidden rounded-lg border border-[#303034]">
                  <div className="flex items-center gap-3 border-b border-[#303034] bg-[#19191b] px-4 py-4 text-sm font-medium">
                    <span className="text-gray-400">▤</span>
                    Card
                  </div>

                  <div className="space-y-4 p-4">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-gray-500">
                        CARD INFORMATION
                      </label>

                      {/* Visual placeholder: replace with Stripe Payment Element */}
                      <div className="overflow-hidden rounded-lg border border-[#303034]">
                        <div className="flex h-[46px] items-center justify-between bg-[#1c1c1e] px-4">
                          <span className="text-sm text-gray-500">
                            1234 1234 1234 1234
                          </span>
                          <span className="text-xs">💳</span>
                        </div>

                        <div className="grid grid-cols-2 border-t border-[#303034]">
                          <div className="flex h-[46px] items-center border-r border-[#303034] bg-[#1c1c1e] px-4 text-sm text-gray-500">
                            MM / YY
                          </div>
                          <div className="flex h-[46px] items-center justify-between bg-[#1c1c1e] px-4 text-sm text-gray-500">
                            CVC
                            <span>ⓘ</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cardholder */}
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-gray-500">
                        CARDHOLDER NAME
                      </label>

                      <input
                        type="text"
                        placeholder="Full name on card"
                        className="h-[46px] w-full rounded-lg border border-[#303034] bg-[#1c1c1e] px-4 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-gray-500">
                        COUNTRY OR REGION
                      </label>

                      <select
                        name="country"
                        defaultValue="BD"
                        className="h-[47px] w-full rounded-lg border border-[#303034] bg-[#1c1c1e] px-3 text-sm outline-none focus:border-blue-500"
                      >
                        <option value="BD">🇧🇩 Bangladesh</option>
                        <option value="US">🇺🇸 United States</option>
                        <option value="GB">🇬🇧 United Kingdom</option>
                        <option value="IN">🇮🇳 India</option>
                        <option value="CA">🇨🇦 Canada</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Information */}
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#303034] p-4">
                <input
                  type="checkbox"
                  name="save_information"
                  className="mt-1 h-[19px] w-[19px] accent-blue-600"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Save my information for faster checkout
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Pay securely on this site and everywhere Link is accepted.
                  </p>
                </div>
              </label>

              {/* Pay Button */}
              <button
                type="submit"
                className="h-[57px] w-full rounded-lg bg-[#086be5] text-base font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#0878fa] active:scale-[0.99]"
              >
                Pay
              </button>
            </form>
            <form action="/api/checkout_sessions" method="POST">
              <section>
                <button type="submit" role="link">
                  Checkout
                </button>
              </section>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
