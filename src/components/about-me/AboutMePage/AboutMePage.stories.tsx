import type { Meta, StoryObj } from "@storybook/react-vite";
import { AboutMePage } from "./AboutMePage";

const meta = {
  title: "about-me/AboutMePage",
  component: AboutMePage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AboutMePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
