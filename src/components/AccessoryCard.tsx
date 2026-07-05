import { asset } from "@/lib/asset";
import AddAccessoryButton from "./AddAccessoryButton";
import { formatPrice } from "@/lib/product-helpers";
import type { Accessory } from "@/lib/types";

export default function AccessoryCard({ item }: { item: Accessory }) {
  const image = item.photos[0];
  const buyable = item.available && item.priceCents != null;
  return (
    <article className="flex flex-col overflow-hidden rounded-sm border border-line bg-surface hairline">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset(image)} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-3xl tracking-wide text-gold/40">
              Sherred &amp; Sons
            </span>
          </div>
        )}
        {!item.available && (
          <span className="absolute left-3 top-3 rounded-sm bg-ink/85 px-2.5 py-1 font-display text-[0.62rem] uppercase tracking-[0.18em] text-gold backdrop-blur">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg text-parchment">{item.name}</h3>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">
          {item.shortDescription}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-lg tabular-nums text-gold">
            {item.priceCents != null ? formatPrice(item.priceCents) : ""}
          </span>
          {buyable ? (
            <AddAccessoryButton
              item={{
                slug: item.slug,
                name: item.name,
                priceCents: item.priceCents as number,
                image: image ?? "",
              }}
              label="Add"
              className="!px-3.5 !py-2"
            />
          ) : (
            <span className="font-display text-xs uppercase tracking-[0.16em] text-muted">
              {item.available ? "" : "Sold out"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
