import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import nanoid from "nanoid";
import useTheme from "../hooks/useTheme";
import useBackground, { BackgroundProvider } from "../hooks/useBackground";
import useAccordion, { AccordionProvider } from "../hooks/useAccordion";
import useAccordionItem, {
  AccordionItemProvider
} from "../hooks/useAccordionItem";
import { mergeProps } from "../utils/component";
import Icon from "./Icon";

const COLORS = ["grey.t07", "secondary.lightBlue.t30", "white"];
const TEXT_COLORS = ["black", "primary.blue.t100"];
const ITEM_GAP = ["small", "large"];
const ITEM_HEADER_AS = ["h2", "h3", "h4", "h5", "h6"];

const DEFAULT_PROPS = {
  color: "grey.t07",
  textColor: "black",
  itemHeaderAs: "h3",
  itemGap: "large"
};

Accordion.COLORS = COLORS;
Accordion.TEXT_COLORS = TEXT_COLORS;
Accordion.ITEM_GAP = ITEM_GAP;
Accordion.ITEM_HEADER_AS = ITEM_HEADER_AS;
Accordion.DEFAULT_PROPS = DEFAULT_PROPS;

function Header({ children }) {
  const theme = useTheme();
  const { color, textColor, itemHeaderAs: HeadingComponent } = useAccordion();
  const {
    headerId,
    contentId,
    isOpen,
    toggleAccordionItem
  } = useAccordionItem();
  const onClick = useCallback(() => {
    toggleAccordionItem();
  }, [toggleAccordionItem]);

  return (
    <HeadingComponent css={theme.accordionHeader}>
      <button
        id={headerId}
        css={{
          ...theme.accordionHeaderButton,
          backgroundColor: theme.getColor(color),
          color: theme.getColor(textColor)
        }}
        aria-controls={contentId}
        aria-expanded={isOpen ? "true" : "false"}
        onClick={onClick}
      >
        <div css={theme.accordionHeaderContent}>{children}</div>
        <div
          css={{
            ...theme.accordionHeaderChevron,
            ...(isOpen && theme["accordionHeaderChevron.open"])
          }}
        >
          <Icon name="chevron-down" color={textColor} />
        </div>
      </button>
    </HeadingComponent>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired
};

function HeaderIcon({ name }) {
  const theme = useTheme();
  const { textColor } = useAccordion();

  return (
    <div css={theme.accordionHeaderIcon}>
      <Icon name={name} color={textColor} />
    </div>
  );
}

HeaderIcon.propTypes = {
  name: PropTypes.oneOf(Icon.NAMES).isRequired
};

function Content({ children }) {
  const theme = useTheme();
  const { color } = useAccordion();
  const backgroundColor =
    color === "grey.t07"
      ? "grey.t03"
      : color === "secondary.lightBlue.t30"
      ? "secondary.lightBlue.t15"
      : "white";
  const { headerId, contentId, isOpen } = useAccordionItem();

  return (
    <BackgroundProvider value={backgroundColor}>
      <div
        id={contentId}
        css={{
          ...theme.accordionContent,
          backgroundColor: theme.getColor(backgroundColor)
        }}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
      >
        {children}
      </div>
    </BackgroundProvider>
  );
}

Content.propTypes = {
  children: PropTypes.node.isRequired
};

const DEFAULT_ITEM_PROPS = {
  initiallyOpen: false
};

Item.DEFAULT_PROPS = DEFAULT_ITEM_PROPS;

function Item(props) {
  const theme = useTheme();
  const { itemGap } = useAccordion();
  const [headerId] = useState(() => `accordion-item-header-${nanoid()}`);
  const [contentId] = useState(() => `accordion-item-content-${nanoid()}`);
  const mergedProps = mergeProps(
    props,
    DEFAULT_ITEM_PROPS,
    {},
    {
      initiallyOpen: initiallyOpen => typeof initiallyOpen === "boolean"
    }
  );
  const { initiallyOpen, children } = mergedProps;
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const toggleAccordionItem = useCallback(() => {
    setIsOpen(isOpen => !isOpen);
  }, []);
  const accordionItemInfo = useMemo(
    () => ({ headerId, contentId, isOpen, toggleAccordionItem }),
    [headerId, contentId, isOpen, toggleAccordionItem]
  );

  return (
    <AccordionItemProvider value={accordionItemInfo}>
      <div css={theme[`accordionItem.${itemGap}`]}>{children}</div>
    </AccordionItemProvider>
  );
}

Item.propTypes = {
  initiallyOpen: PropTypes.bool,
  children: PropTypes.node.isRequired
};

function Accordion(props) {
  const { background } = useBackground();
  const inheritedColor =
    background === "primary.blue.t100" ? "white" : DEFAULT_PROPS.color;
  const inheritedProps = {
    color: inheritedColor
  };
  const mergedProps = mergeProps(props, DEFAULT_PROPS, inheritedProps, {
    color: color => COLORS.includes(color),
    textColor: textColor => TEXT_COLORS.includes(textColor),
    itemGap: itemGap => ITEM_GAP.includes(itemGap),
    itemHeaderAs: itemHeaderAs => ITEM_HEADER_AS.includes(itemHeaderAs)
  });
  const { color, textColor, itemHeaderAs, itemGap, children } = mergedProps;
  const accordionInfo = useMemo(
    () => ({
      color,
      textColor,
      itemGap,
      itemHeaderAs
    }),
    [color, textColor, itemGap, itemHeaderAs]
  );

  return (
    <AccordionProvider value={accordionInfo}>{children}</AccordionProvider>
  );
}

Accordion.propTypes = {
  color: PropTypes.oneOf(COLORS),
  textColor: PropTypes.oneOf(TEXT_COLORS),
  itemGap: PropTypes.oneOf(ITEM_GAP),
  itemHeaderAs: PropTypes.oneOf(ITEM_HEADER_AS),
  children: PropTypes.node.isRequired
};

Header.Icon = HeaderIcon;
Item.Header = Header;
Item.Content = Content;
Accordion.Item = Item;

export default Accordion;
