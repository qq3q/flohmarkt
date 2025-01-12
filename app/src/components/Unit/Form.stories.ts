import type {Meta, StoryObj} from '@storybook/react';
import {fn}                  from '@storybook/test';

import Form from './Form';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
   title     : 'Unit/UnitForm',
   component : Form,
   parameters: {
      // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
      layout: 'centered',
   }, // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
   tags: ['autodocs'], // More on argTypes: https://storybook.js.org/docs/api/argtypes
   argTypes: {
      // backgroundColor: {control: 'color'},
   }, // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
   args: {
      onReady: fn(),
   },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
   args: {
      sellerId: 245,
      validSellerIds: [245],
      amount  : 24.99,
   },
};

export const Empty: Story = {
   args: {
      sellerId: null,
      validSellerIds: [245],
      amount  : null,
   },
};

export const InvalidSellerId: Story = {
   args: {
      sellerId: 244,
      validSellerIds: [245],
      amount  : 10.99,
   },
};

export const AutoFocus: Story = {
   args: {
      sellerId: null,
      validSellerIds: [245],
      amount  : null,
      autoFocus: true,
   },
};

export const RestoreAfterDataSend: Story = {
   args: {
      sellerId: null,
      validSellerIds: [245],
      amount  : null,
      autoFocus: false,
      restoreAfterReady: true,
   },
};
