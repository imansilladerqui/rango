import type { Meta, StoryObj } from '@storybook/react'
import Range from './Range'

const meta: Meta<typeof Range> = {
  title: 'Components/Range',
  component: Range,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Custom dual-bullet range slider. Supports two modes: **normal** (editable labels, continuous values) and **fixed** (read-only labels, snap to preset values).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', padding: '48px 32px', background: '#fff', borderRadius: 16 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Range>

// ─── Normal mode ──────────────────────────────────────────────────────────────

export const Normal: Story = {
  name: 'Normal — 1 to 100',
  args: { mode: 'normal', min: 1, max: 100 },
  parameters: {
    docs: {
      description: {
        story:
          'Both bullets are freely draggable. Click either label to edit the value inline. Min and max can never cross.',
      },
    },
  },
}

export const NormalWideRange: Story = {
  name: 'Normal — 0 to 1 000',
  args: { mode: 'normal', min: 0, max: 1000 },
  parameters: {
    docs: {
      description: { story: 'Same component with a wider value range.' },
    },
  },
}

export const NormalNarrowRange: Story = {
  name: 'Normal — 0 to 10',
  args: { mode: 'normal', min: 0, max: 10 },
}

// ─── Fixed mode ───────────────────────────────────────────────────────────────

export const Fixed: Story = {
  name: 'Fixed — preset prices',
  args: { mode: 'fixed', values: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] },
  parameters: {
    docs: {
      description: {
        story:
          'Bullets snap to the nearest allowed value. Labels are read-only — clicking them does nothing.',
      },
    },
  },
}

export const FixedFewValues: Story = {
  name: 'Fixed — 3 values',
  args: { mode: 'fixed', values: [10, 50, 100] },
}
