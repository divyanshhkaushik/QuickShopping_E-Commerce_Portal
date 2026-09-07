import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import shoppingCartImage from "../../assets/Shopping_cart.jpg";

const defaultCenter = { lat: 12.9716, lng: 77.5946 };
const mapContainerStyle = {
  width: "100%",
  height: "420px",
  borderRadius: "1rem",
};

function AddUserAddress() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [position, setPosition] = useState(defaultCenter);
  const [formData, setFormData] = useState({
    label: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    latitude: "",
    longitude: "",
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const getAddressComponents = (addressComponents = []) => {
    const getComponent = (type) =>
      addressComponents.find((component) => component.types.includes(type))?.long_name || "";

    return {
      city:
        getComponent("locality") ||
        getComponent("administrative_area_level_2") ||
        getComponent("postal_town") ||
        "",
      state: getComponent("administrative_area_level_1") || "",
      pincode: getComponent("postal_code") || "",
      country: getComponent("country") || "India",
    };
  };

  const updateAddressFromLocation = (lat, lng) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const address = results[0];
        const addressComponents = getAddressComponents(address.address_components);

        setFormData((prev) => ({
          ...prev,
          addressLine1: address.formatted_address || "",
          city: addressComponents.city,
          state: addressComponents.state,
          pincode: addressComponents.pincode,
          country: addressComponents.country,
          latitude: lat,
          longitude: lng,
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    });
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setPosition({ lat, lng });
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
    }
    updateAddressFromLocation(lat, lng);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        const lat = geoPosition.coords.latitude;
        const lng = geoPosition.coords.longitude;

        setPosition({ lat, lng });
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
        }
        updateAddressFromLocation(lat, lng);
      },
      () => {
        alert("Unable to fetch your current location.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      alert("Please choose a valid location on the map or use current location.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/address", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Address save failed");
      }

      alert(data.message || "Address saved successfully");
      navigate("/addresses");
    } catch (error) {
      console.error(error);
      alert(error.message || "Address save failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-[#1f2937]">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center blur-md"
        style={{ backgroundImage: `url(${shoppingCartImage})` }}
      />
      <div className="absolute inset-0 bg-slate-950/35" />

      <div className="relative z-10">
        <Navbar />
        <div className="border-b border-[#dfe7f0] bg-[#131921]/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <h1 className="text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-[#93c5fd] via-[#f7b267] to-[#f59e0b] bg-clip-text text-transparent">
                Add New Address
              </span>
            </h1>
            <p className="mt-2 text-[#d1d9e3]">Choose your location and save your delivery details.</p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="rounded-[2rem] border border-white/30 bg-white/80 p-6 shadow-xl shadow-[#dbeafe]/40 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link
              to="/addresses"
              className="rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-2.5 text-sm font-medium text-[#1f2937] transition hover:border-[#93c5fd]"
            >
              ← Back to Addresses
            </Link>

            <button
              type="button"
              onClick={useCurrentLocation}
              className="rounded-xl bg-gradient-to-r from-[#ffb347] to-[#f28c28] px-5 py-3 font-medium text-[#111827] shadow-lg shadow-[#f59e0b]/20 transition hover:scale-[1.01]"
            >
              Use Current Location
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#dfe7f0] bg-[#f8fafc] p-2 shadow-inner shadow-[#e2e8f0]">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={position}
                zoom={13}
                onLoad={(map) => {
                  mapRef.current = map;
                }}
                onClick={handleMapClick}
              >
                <Marker position={position} />
              </GoogleMap>
            ) : (
              <div className="flex h-[420px] items-center justify-center rounded-[1rem] bg-[#eef3f8] text-[#475569]">
                Loading map...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1f2937]">Address Type</label>
              <input
                type="text"
                placeholder="Home / Office"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827] placeholder:text-[#64748b] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1f2937]">Address Line 1</label>
              <input
                type="text"
                placeholder="Address"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="w-full rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827] placeholder:text-[#64748b] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1f2937]">Address Line 2</label>
              <input
                type="text"
                placeholder="Apartment, Building, Landmark"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="w-full rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827] placeholder:text-[#64748b] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1f2937]">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  readOnly
                  className="w-full rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827] placeholder:text-[#64748b] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1f2937]">State</label>
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  readOnly
                  className="w-full rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827] placeholder:text-[#64748b] outline-none"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1f2937]">Pincode</label>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={formData.pincode}
                  readOnly
                  className="w-full rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827] placeholder:text-[#64748b] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1f2937]">Country</label>
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  readOnly
                  className="w-full rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827] placeholder:text-[#64748b] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#ffb347] to-[#f28c28] px-4 py-3 text-base font-semibold text-[#111827] shadow-lg shadow-[#f59e0b]/20 transition hover:scale-[1.01]"
            >
              Save Address
            </button>
          </form>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddUserAddress;