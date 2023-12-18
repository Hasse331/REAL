import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Post from "../../app/components/post";
import useLoginCheck from "../../app/utils/useLoginCheck";
import "@testing-library/jest-dom";

jest.mock("../../app/utils/useLoginCheck", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    query: {
      isCommentPage: "mocked",
    },
  })),
}));

jest.mock("../../app/utils/GetJwtToken", () => jest.fn());

process.env.NEXT_PUBLIC_LOAD_USR_POST_DATA = "/mocked-api-endpoint";
process.env.NEXT_PUBLIC_GET_USRPOST_MEDIA = "/mocked-media-endpoint";
process.env.NEXT_PUBLIC_GET_PROFILE_IMAGE = "/placeholder";

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          post_id: "1",
          user_id: "user123",
          tags: ["tag1", "tag2"],
          profile_name: "Mocked Username",
          title: "Mocked Title",
          text: "Mocked Text",
          media_type: "image",
        }),
      ok: true,
    }) as unknown as Promise<Response>
);

describe("Testing post component", () => {
  test("renders correctly with a logged-in user and fetched data", async () => {
    const mockedUseLoginCheck = useLoginCheck as jest.Mock;
    mockedUseLoginCheck.mockReturnValue(true);

    const mockedGetJwtToken = useLoginCheck as jest.Mock;
    mockedGetJwtToken.mockReturnValue("mocked-token");

    render(<Post />);

    let media;
    try {
      media = await screen.findByAltText("image");
    } catch {
      media = await screen.findByTestId("video");
    }

    expect(media).toBeInTheDocument();

    // Check if the title and text from fetched data are rendered
    expect(screen.getByText("Mocked Title")).toBeInTheDocument();
    expect(screen.getByText("Mocked Text")).toBeInTheDocument();
    expect(screen.getByText("Mocked Username")).toBeInTheDocument();
  });
});
