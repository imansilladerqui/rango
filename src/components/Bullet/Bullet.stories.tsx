import type { Meta, StoryObj } from '@storybook/react'
import Bullet from './Bullet'

/**
 * Bullet is absolutely positioned within a relative track.
 * The decorator below replicates the Range track context so the
 * bullet renders exactly as it does in production.
 */
const meta: Meta<typeof Bullet> = {
  title: 'Components/Bullet',
  component: Bullet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The draggable handle of the Range slider. Positioned absolutely within the track. Grows on hover and switches to a grabbing cursor while dragging.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          width: 400,
          height: 4,
          background: '#dddddd',
          borderRadius: 2,
          margin: '48px 16px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    percent: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Position along the track (0 = far left, 100 = far right)',
    },
    onMouseDown: { action: 'mousedown' },
  },
}

export default meta
type Story = StoryObj<typeof Bullet>

export const AtStart: Story = {
  name: 'At 0 % (start)',
  args: { percent: 0, onMouseDown: () => {} },
}

export const AtMiddle: Story = {
  name: 'At 50 % (middle)',
  args: { percent: 50, onMouseDown: () => {} },
}

export const AtEnd: Story = {
  name: 'At 100 % (end)',
  args: { percent: 100, onMouseDown: () => {} },
}

export const Playground: Story = {
  name: 'Playground — drag the control',
  args: { percent: 30, onMouseDown: () => {} },
  parameters: {
    docs: {
      description: {
        story:
          'Use the **percent** control in the panel below to slide the bullet along the track.',
      },
    },
  },
}
