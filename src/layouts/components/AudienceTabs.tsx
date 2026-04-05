import React, { useId, useState } from "react";
import { isExternalUrl } from "@/lib/utils/url";

type AudienceButton = {
  label: string;
  link: string;
  enable?: boolean;
};

type AudienceTabItem = {
  name: string;
  title: string;
  content: string;
  emphasis?: string;
  note?: string;
  button?: AudienceButton;
};

const AudienceTabs = ({ items }: { items: AudienceTabItem[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabId = useId();
  const activeItem = items[activeIndex];
  const isExternal = isExternalUrl(activeItem?.button?.link);

  if (!items?.length) return null;

  return (
    <div className="audience-tabs">
      <div className="audience-tabs-list" role="tablist" aria-label="Audience tabs">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={`${tabId}-${item.name}`}
              id={`${tabId}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tabId}-panel-${index}`}
              className={`audience-tab-button ${isActive ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      <div
        id={`${tabId}-panel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`${tabId}-tab-${activeIndex}`}
        className="audience-panel"
      >
        <h2
          className="max-w-[640px]"
          dangerouslySetInnerHTML={{ __html: activeItem.title }}
        />
        <p className="mt-4 max-w-[680px] text-base leading-7 text-text md:text-lg">
          {activeItem.content}
        </p>

        {activeItem.emphasis && (
          <p
            className="mt-4 max-w-[720px] font-primary text-lg font-semibold italic text-text-dark"
            dangerouslySetInnerHTML={{ __html: activeItem.emphasis }}
          />
        )}

        {activeItem.note && (
          <p className="mt-4 max-w-[720px] text-sm text-text">{activeItem.note}</p>
        )}

        {activeItem.button?.enable !== false && activeItem.button?.label && (
          <a
            className="btn btn-primary mt-6"
            href={activeItem.button.link}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {activeItem.button.label}
          </a>
        )}
      </div>
    </div>
  );
};

export default AudienceTabs;
