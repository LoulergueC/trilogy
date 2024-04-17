import React from "react";
import { fireEvent, render } from "@testing-library/react";
import Card from "../Card";
import CardContent from "../content";

describe("Card", () => {
  it("should render children when passed in", () => {
    const { getByText } = render(
      <Card>
        <CardContent>Hello world</CardContent>
      </Card>
    );
    expect(getByText("Hello world")).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(
      <Card onClick={handleClick} data-testid="card" />
    );
    fireEvent.click(getByTestId("card"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("should render as loading when skeleton prop is true", () => {
    const { getByTestId } = render(<Card skeleton data-testid="card" />);
    expect(getByTestId("card")).toHaveClass("is-loading");
  });

  it("should render with the flat class when flat prop is true", () => {
    const { getByTestId } = render(<Card flat data-testid="card" />);
    expect(getByTestId("card")).toHaveClass("is-flat");
  });
});

describe("CardContent component", () => {
  it("should render a div with a class of card-content", () => {
    const { getByTestId } = render(<CardContent data-testid="card-content" />);
    const cardContentDiv = getByTestId("card-content");
    expect(cardContentDiv).toHaveClass("card-content");
  });

  it("should render a sup title if titleSup prop is passed", () => {
    const titleSup = "This is a sup title";
    const { getByText } = render(<CardContent titleSup={titleSup} />);
    const supTitleElement = getByText(titleSup);
    expect(supTitleElement).toBeInTheDocument();
  });

  it("should render a title if title prop is passed", () => {
    const title = "This is a title";
    const { getByText } = render(<CardContent title={title} />);
    const titleElement = getByText(title);

    expect(titleElement).toBeInTheDocument();
  });

  it("should render a text if text prop is passed", () => {
    const text = "This is some content text";
    const { getByText } = render(<CardContent text={text} />);
    const textElement = getByText(text);
    expect(textElement).toBeInTheDocument();
  });

  it("should have title", () => {
    const { getByTestId } = render(
      <CardContent testId="cardContent" title="title" titleLevel="ONE" />
    );
    const title = getByTestId("cardContent-title");
    expect(title).toBeInTheDocument();
  });

  it("should render a button if buttonText prop is passed", () => {
    const fn = jest.fn();
    const buttonText = "Click me";
    const { getByTestId } = render(
      <CardContent
        testId="cardContent"
        onClick={fn}
        buttonText={buttonText}
        buttonVariant="PRIMARY"
        buttonMarkup="a"
      />
    );
    const buttonElement = getByTestId("cardContent");
    const btn = getByTestId("cardContent-btn");
    fireEvent.click(buttonElement);
    expect(fn).toHaveBeenCalled();
    expect(btn.nodeName).toBe("A");
    expect(btn).toHaveClass("is-loaded is-main ");
    expect(btn).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });
});
