import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export default function EpanetVisualizer({
  nodes,
  edges,
}: {
  nodes: any[];
  edges: any[];
}) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const width = 1500;
    const height = 900;
    const margin = 100;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll('*').remove();
    const g = svg.append('g');

    /* ================= TOOLTIP ================= */

    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', '#0f172a')
      .style('color', '#e2e8f0')
      .style('padding', '14px')
      .style('border-radius', '10px')
      .style('border', '1px solid #334155')
      .style('font-size', '13px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('min-width', '200px')
      .style('box-shadow', '0 10px 30px rgba(0,0,0,0.5)');

    const showTooltip = (event: any, html: string) => {
      tooltip
        .html(html)
        .style('left', event.pageX + 15 + 'px')
        .style('top', event.pageY + 15 + 'px')
        .transition()
        .duration(150)
        .style('opacity', 1);
    };

    const hideTooltip = () => {
      tooltip.transition().duration(150).style('opacity', 0);
    };

    /* ================= SCALES ================= */

    const x = d3
      .scaleLinear()
      .domain(d3.extent(nodes, (d) => d.x) as [number, number])
      .range([margin, width - margin]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(nodes, (d) => d.y) as [number, number])
      .range([height - margin, margin]);

    const byId = new Map(nodes.map((n) => [n.id, n]));

    /* ================= PRESSURE COLOR ================= */

    const pressureColor = (p?: number) => {
      if (p == null) return '#64748b';
      if (p < 10) return '#dc2626';
      if (p < 30) return '#f97316';
      if (p <= 60) return '#facc15';
      return '#22c55e';
    };

    /* ================= PIPES + PUMPS ================= */

    g.selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('x1', (d) => x(byId.get(d.source)?.x))
      .attr('y1', (d) => y(byId.get(d.source)?.y))
      .attr('x2', (d) => x(byId.get(d.target)?.x))
      .attr('y2', (d) => y(byId.get(d.target)?.y))
      .attr('stroke', (d) =>
        d.type === 'pump' ? '#a855f7' : '#3b82f6'
      )
      .attr('stroke-width', (d) =>
        d.type === 'pump' ? 4 : 2.5
      )
      .on('mousemove', (event, d: any) => {
        if (d.type === 'pipe') {
          showTooltip(
            event,
            `
            <div style="font-weight:bold;margin-bottom:6px;color:#38bdf8">
              Pipe: ${d.id}
            </div>
            <div>From: ${d.source}</div>
            <div>To: ${d.target}</div>
            <div>Length: ${d.length ?? 'N/A'}</div>
            <div>Diameter: ${d.diameter ?? 'N/A'}</div>
            <div>Roughness: ${d.roughness ?? 'N/A'}</div>
            <div>Loss Coeff: ${d.loss_coeff ?? 'N/A'}</div>
            <div>Status: ${d.status ?? 'N/A'}</div>
            `
          );
        } else if (d.type === 'pump') {
          showTooltip(
            event,
            `
            <div style="font-weight:bold;margin-bottom:6px;color:#c084fc">
              Pump: ${d.id}
            </div>
            <div>From: ${d.source}</div>
            <div>To: ${d.target}</div>
            <div>Curve: ${d.pump_curve ?? 'N/A'}</div>
            <div>Status: ${d.status ?? 'N/A'}</div>
            `
          );
        }
      })
      .on('mouseout', hideTooltip);

    /* ================= JUNCTIONS ================= */

    g.selectAll('circle')
      .data(nodes.filter((n) => n.type === 'junction'))
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 6)
      .attr('fill', (d) => pressureColor(d.pressure))
      .attr('stroke', '#0f172a')
      .on('mousemove', (event, d: any) => {
        showTooltip(
          event,
          `
          <div style="font-weight:bold;margin-bottom:6px;color:#facc15">
            Junction: ${d.id}
          </div>
          <div>Elevation: ${d.elevation ?? 'N/A'}</div>
          <div>Base Demand: ${d.base_demand ?? 'N/A'}</div>
          <div>Pressure: ${d.pressure?.toFixed(2) ?? 'N/A'} m</div>
          `
        );
      })
      .on('mouseout', hideTooltip);

    /* ================= TANKS ================= */

    g.selectAll('rect')
      .data(nodes.filter((n) => n.type === 'tank'))
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.x) - 10)
      .attr('y', (d) => y(d.y) - 10)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', '#22c55e')
      .on('mousemove', (event, d: any) => {
        showTooltip(
          event,
          `
          <div style="font-weight:bold;margin-bottom:6px;color:#4ade80">
            Tank: ${d.id}
          </div>
          <div>Elevation: ${d.elevation ?? 'N/A'}</div>
          <div>Initial Level: ${d.init_level ?? 'N/A'}</div>
          <div>Min Level: ${d.min_level ?? 'N/A'}</div>
          <div>Max Level: ${d.max_level ?? 'N/A'}</div>
          <div>Diameter: ${d.diameter ?? 'N/A'}</div>
          `
        );
      })
      .on('mouseout', hideTooltip);

    /* ================= RESERVOIRS ================= */

    g.selectAll('polygon')
      .data(nodes.filter((n) => n.type === 'reservoir'))
      .enter()
      .append('polygon')
      .attr('points', '0,-12 12,12 -12,12')
      .attr('transform', (d) => `translate(${x(d.x)}, ${y(d.y)})`)
      .attr('fill', '#3b82f6')
      .on('mousemove', (event, d: any) => {
        showTooltip(
          event,
          `
          <div style="font-weight:bold;margin-bottom:6px;color:#60a5fa">
            Reservoir: ${d.id}
          </div>
          <div>Head: ${d.head ?? 'N/A'}</div>
          `
        );
      })
      .on('mouseout', hideTooltip);

    /* ================= ZOOM ================= */

    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 6])
        .on('zoom', (e) => g.attr('transform', e.transform))
    );

    return () => {
      tooltip.remove();
    };
  }, [nodes, edges]);

  return (
    <svg
      ref={ref}
      width="100%"
      height="900"
      className="bg-slate-950 rounded-lg"
    />
  );
}
