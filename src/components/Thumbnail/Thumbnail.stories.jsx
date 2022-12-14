import { Thumbnail } from "./Thumbnail"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "Undex/Thumbnail",
    component: Thumbnail
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
}

export const Primary = () =>
    <Thumbnail />