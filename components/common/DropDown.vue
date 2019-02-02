<template>
  <div ref="dropDown" class="btn-group" @blur.native.capture="closeMenu">
    <li @click="toggleMenu()" class="dropdown-toggle">
      {{ selectedOption.name ? selectedOption.name : placeholderText }}
      <span class="caret"></span>
    </li>

    <ul class="dropdown-menu" v-if="v_menu">
      <li v-for="option in options">
        <a href="javascript:void(0)" @click="updateOption(option)">
          {{ option.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selectedOption: {
          name: ''
        },
        v_menu: false,
        placeholderText: ''
      }
    },
    props: {
      options: {
        type: [Array, Object]
      },
      selected: {},
      placeholder: [String]
    },

    mounted() {
      this.selectedOption = this.selected
      if (this.placeholder) {
        this.placeholderText = this.placeholder
      }

      document.addEventListener('click', this.hideMenu, false)

    },
    methods: {
      updateOption(option) {
        this.selectedOption = option
        this.v_menu = false
        this.$emit('updateOption', this.selectedOption)
      },
      toggleMenu() {
        this.v_menu = !this.v_menu
      },
      hideMenu(e) {
        if (!this.$refs.dropDown || !this.$refs.dropDown.contains(e.target)) {
          this.v_menu = false
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .btn-group {
    min-width: px2rem(100);
    height: px2rem(40);
    position: relative;
    margin: px2rem(10) px2rem(1);
    display: inline-block;
    vertical-align: middle;
  }

  .btn-group a:hover {
    text-decoration: none;
  }

  .dropdown-toggle {
    color: #636b6f;
    min-width: px2rem(100);
    padding: px2rem(10);
    text-transform: none;
    font-weight: 400;
    margin-bottom: px2rem(7);
    border: 0;
    transition: background 0s ease-out;
    float: none;
    box-shadow: none;
    border-radius: 0;
  }

  .dropdown-toggle:hover {
    background: #e1e1e1;
    cursor: pointer;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100;
    float: left;
    min-width: px2rem(100);
    padding: px2rem(5) 0;
    margin: px2rem(2) 0 0;
    list-style: none;
    text-align: left;
    background-color: #fff;
    border: px2rem(1) solid rgba(230, 230, 230, 0.5);
    border-radius: px2rem(4);
    box-shadow: 0 px2rem(6) px2rem(12) rgba(0, 0, 0, 0.175);
    background-clip: padding-box;
  }

  .dropdown-menu > li > a {
    padding: px2rem(10) px2rem(30);
    display: block;
    clear: both;
    font-weight: normal;
    color: #333333;
    white-space: nowrap;
    text-decoration: none;
  }

  .dropdown-menu > li > a:hover {
    background: #efefef;
    color: #F52626;
  }

  .dropdown-menu > li {
    overflow: hidden;
    width: 100%;
    position: relative;
    margin: 0;
  }

  .caret {
    width: 0;
    position: relative;
    top: px2rem(10);
    height: 0;
    margin-left: px2rem(2);
    vertical-align: middle;
    border-top: px2rem(10) dashed;
    border-right: px2rem(10) solid transparent;
    border-left: px2rem(10) solid transparent;
    float: right;
  }

  li {
    list-style: none;
  }
</style>