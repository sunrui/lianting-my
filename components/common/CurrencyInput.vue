<template>
  <div>
    <label>
      <input
        class="currency_input"
        v-bind:class="{right: right}"
        ref="input"
        type="number"
        :placeholder="placeholder"
        v-bind:value="value"
        v-on:input="updateValue($event.target.value)"
      >
    </label>
  </div>
</template>

<script>
  export default {
    props: {
      value: Number,
      placeholder: String,
      right: String
    },
    mounted() {
      this.$refs.input.value = this.formatPrice(this.$refs.input.value)
    },
    methods: {
      formatPrice(value) {
        value = value.replace(/[^\d.]/g, '')
        value = value.replace(/^\./g, '')
        value = value.replace(/\.{2,}/g, '.')
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')

        let integer = ''
        let float = null
        let index = value.indexOf('.')
        if (index !== -1) {
          integer = value.substring(0, index)
          float = value.substring(index + 1)
        } else {
          integer = value
        }

        value = integer.substring(0, 4)
        if (float) {
          value += '.' + float
        }

        if (value.indexOf('.') < 0 && value !== '') {
          value = parseFloat(value)
        }

        return value
      },
      updateValue: function (value) {
        this.$refs.input.value = this.formatPrice(value)

        if (!Boolean(this.$refs.input.value)) {
          this.$refs.input.value = 0
        }

        this.$emit('input', parseFloat(this.$refs.input.value))
      }
    }
  }
</script>

<style scoped lang="scss">
  .currency_input {
    border: none;
    outline: medium;
    color: #666666;
    font-size: px2rem(28);
    text-align: center;
  }

  .right {
    text-align: right;
  }
</style>
