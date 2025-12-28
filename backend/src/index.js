export default {
  async fetch(request) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");

    if (!q) {
      return new Response(
        "請在網址後面加 ?q=IP 或域名，例如 ?q=8.8.8.8",
        { status: 400 }
      );
    }

    // 查 IP 归属地
    const ipinfo = await fetch(`https://ipwho.is/${q}`)
      .then(r => r.json())
      .catch(() => null);

    // 查 BGP / ASN
    const bgp = await fetch(`https://api.bgpview.io/ip/${q}`)
      .then(r => r.json())
      .catch(() => null);

    const result = {
      query: q,
      country: ipinfo?.country || null,
      city: ipinfo?.city || null,
      isp: ipinfo?.connection?.org || null,
      asn: ipinfo?.connection?.asn || null,
      prefix: bgp?.data?.prefixes?.[0]?.prefix || null
    };

	return new Response(JSON.stringify(result, null, 2), {
  	headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  }
});

  }
};
