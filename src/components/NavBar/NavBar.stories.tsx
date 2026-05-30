import type { Meta, StoryObj } from '@storybook/react'
import NavBar from './NavBar'

const meta: Meta<typeof NavBar> = {
  title: 'Components/NavBar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    withRouter: true,
    docs: {
      description: {
        component:
          'Top navigation bar. Active route is highlighted with a red bottom border; inactive links dim to grey.',
      },
    },
  },
  argTypes: {
    items: {
      description: 'Array of `{ to, label }` navigation items',
    },
  },
}

export default meta
type Story = StoryObj<typeof NavBar>

export const Default: Story = {
  name: 'Both exercises',
  args: {
    items: [
      { to: '/exercise1', label: 'Exercise 1 — Normal Range' },
      { to: '/exercise2', label: 'Exercise 2 — Fixed Range' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Exercise 1 is active because the MemoryRouter starts at `/exercise1`.',
      },
    },
  },
}

export const SingleItem: Story = {
  name: 'Single item',
  args: {
    items: [{ to: '/exercise1', label: 'Exercise 1 — Normal Range' }],
  },
}

export const NoItems: Story = {
  name: 'Empty (no items)',
  args: { items: [] },
  parameters: {
    docs: {
      description: { story: 'Edge case: renders an empty nav bar.' },
    },
  },
}
