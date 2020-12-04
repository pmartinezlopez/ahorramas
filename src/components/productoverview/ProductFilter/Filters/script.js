/* eslint-disable no-prototype-builtins */
import Standard from './Standard/index.vue';
import Colors from './Colors/index.vue';
import Brand from './Brand/index.vue';

export default {
  props: ['name', 'terms', 'component'],
  components: {
    Standard,
    Colors,
    Brand,
  },
  methods: {
    filterChange(e) {
      this.$emit('changed', e);
    },
  },
};
