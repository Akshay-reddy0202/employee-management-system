import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { PieChart, LineChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([
  PieChart,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  LineChart,
  GridComponent,
]);
export const appConfig: ApplicationConfig = {
  providers: [
    provideEchartsCore({ echarts }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
    }),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
  ],
};
