import type { Meta, StoryObj } from '@storybook/react'
import Label from './Label'

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Value label displayed at both ends of the Range track. In **editable** mode the user can click to open an inline number input. In **read-only** mode it is a plain span.',
      },
    },
  },
  argTypes: {
    value: { control: 'number', description: 'Current numeric value to display' },
    editable: { control: 'boolean', description: 'Whether the user can click to edit' },
    onCommit: { action: 'committed' },
  },
}

export default meta
type Story = StoryObj<typeof Label>

// ─── Editable ────────────────────────────────────────────────────────────────

export const EditableInteger: Story = {
  name: 'Editable — integer value',
  args: { value: 1, editable: true, onCommit: () => {} },
  parameters: {
    docs: {
      description: {
        story:
          'Click the label to open the inline input. Press Enter or blur to commit, Escape to cancel.',
      },
    },
  },
}

export const EditableFloat: Story = {
  name: 'Editable — float value',
  args: { value: 70.99, editable: true, onCommit: () => {} },
  parameters: {
    docs: {
      description: { story: 'Float values are displayed with two decimal places.' },
    },
  },
}

// ─── Read-only ────────────────────────────────────────────────────────────────

export const ReadOnly: Story = {
  name: 'Read-only (fixed mode)',
  args: { value: 30.99, editable: false, onCommit: () => {} },
  parameters: {
    docs: {
      description: {
        story: 'Used in Exercise 2. No hover effect, no click-to-edit — plain span only.',
      },
    },
  },
}

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: { value: 50, editable: true, onCommit: () => {} },
}
