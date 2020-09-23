<template>
  <div>
    <StepBar></StepBar>
    <!-- <BindingRooms v-if="$route.path === '/owner-management/home'"></BindingRooms> -->
    <!-- <BindingRooms v-show="dialog_visible" @dialogVisibleEvent="showDialog"></BindingRooms> -->
    <!-- <ChooseHouse v-show=" dialogo_visible" @dialogVisibleEvento="showDialogo"></ChooseHouse> -->
    <!-- <ChooseHouse v-show="dialog_visible?dialogo_visible=false :dialogo_visible=false" @dialogVisibleEvento="showDialogo"></ChooseHouse> -->
    <!-- <Last v-show="dialogo_visible?dialogt_visible=false:dialogt_visible=true" @dialogVisibleEventt="showDialogt"></Last> -->
    <!-- <Last v-show="dialogt_visible" @dialogVisibleEventt="showDialogt"></Last> -->

    <BindingRooms
      v-show="one_visible"
      @oneVisible="showOne"
    ></BindingRooms>
    <!-- <ChooseHouse
      v-show="two_visible"
      @twoVisible="showTwo"
      @RoomId="RoomId1"
    ></ChooseHouse> -->
    <ChooseHouse
      v-show="two_visible"
      @twoVisible="showTwo"
      @RoomId="RoomId1"
    ></ChooseHouse>

    <!-- <BindingRooms v-show="one_visible?two_visible=false:two_visible=true" @oneVisible="showOne"></BindingRooms> -->
    <!-- <ChooseHouse
      v-show="one_visible=false?two_visible=true:two_visible=false"
      @twoVisible="showTwo"
    ></ChooseHouse> -->
    <Last
      v-show="three_visible"
      :room="RoomId"
      @threeVisible="showThree"
    ></Last>
  </div>
</template>

<script>
import bus from '@/main'
const StepBar = () => import('@/components/StepBar')
const BindingRooms = () =>
  import('@/views/owner-management/components/binding-rooms')
const ChooseHouse = () =>
  import('@/views/owner-management/components/choose-house')

const Last = () => import('@/views/owner-management/components/last')
export default {
  components: {
    StepBar,
    BindingRooms,
    ChooseHouse,
    Last
  },
  data() {
    return {
      one_visible: true,
      two_visible: false,
      three_visible: false,
      RoomId: ''
    }
  },
   mounted() {
    bus.$on('twoVisible', (msg) => {
      this.two_visible = msg
    })
     bus.$on('threeVisible', (msg) => {
      this.three_visible = msg
    })
     bus.$on('oneVisible', (msg) => {
      this.one_visible = msg
    })
  },
  methods: {
    showOne(visible) {
      this.one_visible = visible
    },
    showTwo(visible) {
      // debugger
      this.two_visible = visible
    },
    RoomId1(val) {
      console.log(val, '这是home发射过来的值')
      this.RoomId = val
    },
    showThree(visible) {
      //  debugger
      this.three_visible = visible
    },
    get() {
      var data2 = this.$route.query
      var ownerIdList = data2
      console.log(ownerIdList, 88888888888585855555)

      // console.log(data2)
    }
  }
  // components: {
  //   BindingRooms: {
  //     template: '<BindingRooms></BindingRooms>'
  //   },
  //   Unbundling: {
  //     template: '<Unbundling></Unbundling>'
  //   },
  //   Last: {
  //     template: '<Last></Last>'
  //   }
  // },
  // data() {
  //   return {
  //     currentView: 'BindingRooms'
  //   }
  // },
  // methods: {
  //   changeView: function(data) {
  //     this.currentView = 'com' + data // 动态地改变currentView的值就可以动态挂载组件了。
  //   }
  // }
}
</script>

<style>
</style>
