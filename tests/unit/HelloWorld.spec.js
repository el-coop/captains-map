import { shallowMount } from '@vue/test-utils';
import EditLayout from '@/views/EditLayout.vue';

describe('EditLayout.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(EditLayout);
    expect(wrapper.text()).toMatch(msg);
  });
});
