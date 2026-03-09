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
      <div className="bg-[#19363B] border border-[#E1B624]/30 px-3 py-2 rounded-md shadow-lg">
        <p className="text-[#F5E6D3] text-sm font-display font-semibold">
          {payload[0].payload.role || payload[0].name}
        </p>
        <p className="text-[#E1B624] text-sm">
          {payload[0].value}{payload[0].payload.role ? "" : "%"}
        </p>
      </div>
    );
  }
  return null;
};

const EventStats = ({ donutData, barData, stats, subtitle }: EventStatsProps) => {
  return (
    <section className="py-24 px-6 bg-black" id="data">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#E1B624] text-xs tracking-[0.3em] uppercase mb-4 font-body">
            The Data That Matters
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[#F5E6D3] mb-4">
            Who Is In The Room?
          </h2>
          <p className="text-[#F5E6D3]/60 font-body max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Donut Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#19363B] border border-[#F5E6D3]/10 rounded-xl p-8 shadow-lg"
          >
            <h3 className="font-display font-bold text-lg text-[#F5E6D3] mb-6">
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
                  <span className="text-xs text-[#F5E6D3]/70">
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
            className="bg-[#19363B] border border-[#F5E6D3]/10 rounded-xl p-8 shadow-lg"
          >
            <h3 className="font-display font-bold text-lg text-[#F5E6D3] mb-6">
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
                    fill: "#F5E6D3",
                    fontSize: 11,
                    fontFamily: "Space Grotesk",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill="#E1B624"
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
              className="bg-[#19363B] border border-[#E1B624]/20 rounded-xl p-6 text-center shadow-lg"
            >
              <p className="font-display font-extrabold text-3xl md:text-4xl text-[#E1B624]">
                {stat.num}
              </p>
              <p className="text-[#F5E6D3]/70 text-sm mt-1 font-body">
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
