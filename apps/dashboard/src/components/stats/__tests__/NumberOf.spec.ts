import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import NumberOf from '../NumberOf.vue';

describe('Number Of', () => {
  const wrapper = mount(NumberOf, { props: { title: 'Stats', subTitle: 'Sub Title', number: '13' } });

  it('it render title with stats', () => {
    expect(wrapper.text()).toContain('13 Stats');
  });

  it('it rendered sub title.', () => {
    expect(wrapper.find('.text-secondary').text()).toContain('Sub Title');
  });
});
