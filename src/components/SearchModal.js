import { useEffect, useMemo, useRef, useState } from "react";

const SearchModal = ({
  open,
  title,
  columns,
  data,
  onClose,
  onSelect,
}) => {
  const inputRef = useRef(null);

  const [keyword, setKeyword] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open) return;

    setKeyword("");
    setActiveIndex(0);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [open]);

  const filteredData = useMemo(() => {

    if (!keyword) return data;

    return data.filter((row) =>
      columns.some((col) =>
        String(row[col.accessor] ?? "")
          .toLowerCase()
          .includes(keyword.toLowerCase())
      )
    );

  }, [keyword, data, columns]);

  const handleKeyDown = (e) => {

    switch (e.key) {

      case "ArrowDown":

        e.preventDefault();

        setActiveIndex((prev) =>
          Math.min(prev + 1, filteredData.length - 1)
        );

        break;

      case "ArrowUp":

        e.preventDefault();

        setActiveIndex((prev) =>
          Math.max(prev - 1, 0)
        );

        break;

      case "Enter":

        e.preventDefault();

        if (filteredData[activeIndex]) {
          onSelect(filteredData[activeIndex]);
        }

        break;

      case "Escape":

        onClose();

        break;

      default:
        break;
    }
  };

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-[700px]">

        {/* HEADER */}

        <div className="flex justify-between items-center px-5 py-3 bg-[#222C5F] text-white rounded-t-xl">

          <p className="font-semibold">{title}</p>

          <button
            onClick={onClose}
            className="font-bold hover:text-red-300"
          >
            ✕
          </button>

        </div>

        {/* SEARCH */}

        <div className="p-4">

          <input
            ref={inputRef}
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Cari..."
            className="w-full border rounded-lg p-4"
          />

        </div>

        {/* TABLE */}

        <div className="max-h-[350px] overflow-y-auto px-4 pb-4">

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-gray-100 sticky top-0">

                {
                  columns.map(col => (

                    <th
                      key={col.accessor}
                      className="border p-2 text-left"
                    >
                      {col.header}
                    </th>

                  ))
                }

              </tr>

            </thead>

            <tbody>

              {
                filteredData.length > 0 ? (

                  filteredData.map((row, index) => (

                    <tr
                      key={row.id}
                      onClick={() => {
                        setActiveIndex(index);
                      }}
                      onDoubleClick={() => onSelect(row)}
                      className={`
                        cursor-pointer

                        ${
                          activeIndex === index
                            ? "bg-[#222C5F] text-white"
                            : "hover:bg-gray-100"
                        }
                      `}
                    >

                      {
                        columns.map(col => (

                          <td
                            key={col.accessor}
                            className="border p-2"
                          >
                            {row[col.accessor]}
                          </td>

                        ))
                      }

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={columns.length}
                      className="text-center p-4"
                    >
                      Tidak ada data
                    </td>

                  </tr>

                )
              }

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="bg-gray-100 text-xs px-5 py-2 rounded-b-xl flex gap-6">

          <span>↑↓ Navigasi</span>

          <span>Enter Pilih</span>

          <span>Double Click Pilih</span>

          <span>Esc Tutup</span>

        </div>

      </div>

    </div>

  );
};

export default SearchModal;