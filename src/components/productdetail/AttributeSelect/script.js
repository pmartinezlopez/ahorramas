import isEqual from 'lodash.isequal';

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    values: {
      type: Array,
      required: true,
    },
    variantCombinations: {
      type: Array,
      required: true,
    },
    selected: {
      type: Object,
      required: true,
    },
  },
  computed: {
    distinctValues() {
      return new Set(this.values);
    },
    selectedValue: {
      get() {
        return this.selected[this.name];
      },
      set(value) {
        const selectedSku = this.findSelectedSku(value);
        this.$router.push({ path: selectedSku });
      },
    },
  },
  methods: {
    findSelectedSku(value) {
      const selected = { ...this.selected };
      selected[this.name] = value;
      return (this.findExactSelectedCombi(selected) || this.findFallbackSelectedCombi(selected)).sku;
    },
    findExactSelectedCombi(selected) {
      const { sku: selectedSku, ...selectedAttributes } = selected;
      return this.variantCombinations.find((combi) => {
        const { sku: combiSku, ...combiAttributes } = combi;
        this.castAttributesToString(combiAttributes);
        this.castAttributesToString(selectedAttributes);
        return isEqual(combiAttributes, selectedAttributes);
      });
    },
    findFallbackSelectedCombi(selected) {
      return this.variantCombinations.find(combi => selected[this.name] === combi[this.name]);
    },
    castAttributesToString(object) {
      // eslint-disable-next-line
      Object.keys(object).forEach(key => object[key] = String(object[key]));
    },
  },
};
