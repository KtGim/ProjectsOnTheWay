import { defineComponent } from "vue";
import logo from '../../assets/imgs/tenant-icon.png';
import './index.less'

export default defineComponent({
  setup() {
    return () => <div class="tenant-header">
      <div class="logo-container">
        <div class="logo">
          <img src={logo} /> <span>TenantUI</span>
        </div>
      </div>
      <div class="action-bar">
        <a href="https://git.souban.io/qianjingjing/tenantui">
          <span class="gh-ico"></span>
        </a>
      </div>
    </div>
  }
})