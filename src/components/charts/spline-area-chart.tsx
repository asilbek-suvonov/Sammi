import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useTheme } from '@/context/theme-provider'
import type { ApexOptions } from 'apexcharts'

export interface SplineSeries {
  name: string
  data: number[]
}

interface SplineAreaChartProps {
  series: SplineSeries[]
  categories: string[]
  height?: number
}

export function SplineAreaChart({
  series,
  categories,
  height = 320,
}: SplineAreaChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const options = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
        background: 'transparent',
        fontFamily: 'inherit',
        animations: {
          enabled: true,
          speed: 350,
        },
      },
      theme: { mode: isDark ? 'dark' : 'light' },
      colors: ['#3b82f6', '#a855f7'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      grid: {
        borderColor: isDark ? '#27272a' : '#e5e7eb',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: isDark ? '#a1a1aa' : '#71717a',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: isDark ? '#a1a1aa' : '#71717a',
            fontSize: '12px',
          },
        },
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        x: { show: true },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: isDark ? '#e4e4e7' : '#3f3f46' },
        markers: { size: 6, strokeWidth: 0 },
      },
    }),
    [categories, isDark]
  )

  return (
    <Chart
      key={isDark ? 'dark' : 'light'}
      options={options}
      series={series}
      type='area'
      height={height}
    />
  )
}
