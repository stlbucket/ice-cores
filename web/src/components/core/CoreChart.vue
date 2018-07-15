
<script>
  import { Line, mixins } from 'vue-chartjs'

  export default {
    extends: Line,
    mixins: [ mixins.reactiveProp, mixins.reactiveData ],
    props: ['chartData', 'options'],
    mounted () {
      // Overwriting base render method with actual data.
      // console.log('chartData', this.chartData)
      this.renderChart(this.chartData, {
        responsive: true,
        maintainAspectRatio: false
      })
    }
  }
</script>