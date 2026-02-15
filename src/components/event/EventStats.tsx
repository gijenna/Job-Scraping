import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface DonutItem {
  name: string;
  value: number;
  color: string;
}

interface BarItem {
  role: string;
  count: number;
}

interface StatCard {
  num: string;
  label: string;
}

interface EventStatsProps {
  donutData: DonutItem[];
  barData: BarItem[];
  stats: StatCard[];
  subtitle: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border px-3 py-2 rounded-md shadow-card">
        <p className="text-foreground text-sm font-display font-semibold">
          {payload[0].payload.role || payload[0].name}
        </p>
        <p className="text-primary text-sm">
          {payload[0].value}{payload[0].payload.role ? "" : "%"}
        </p>
      </div>
    );
  }
  return null;
};

const EventStats = ({ donutData, barData, stats, subtitle }: EventStatsProps) => {
  return (
    <section className="py-24 px-6" id="data">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">
            The Data That Matters
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            Who Is In The Room?
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Donut Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-card border border-border rounded-xl p-8 shadow-card"
          >
            <h3 className="font-display font-bold text-lg text-foreground mb-6">
              Attendee Career Fields
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {donutData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {d.name} ({d.value}%)
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-card border border-border rounded-xl p-8 shadow-card"
          >
            <h3 className="font-display font-bold text-lg text-foreground mb-6">
              Top Roles Represented
            </h3>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="role"
                  type="category"
                  width={160}
                  tick={{
                    fill: "hsl(220, 10%, 55%)",
                    fontSize: 11,
                    fontFamily: "Space Grotesk",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill="#ED7660"
                  radius={[0, 4, 4, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Big stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-card border border-border rounded-xl p-6 text-center shadow-card"
            >
              <p className="font-display font-extrabold text-3xl md:text-4xl text-gradient-gold">
                {stat.num}
              </p>
              <p className="text-muted-foreground text-sm mt-1 font-body">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventStats;
