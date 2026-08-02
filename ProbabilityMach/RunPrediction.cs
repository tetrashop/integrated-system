using System;

namespace ProbabilityMach
{
    class RunPrediction
    {
        static void Main()
        {
            WorldCupPredictor.Run("index.html");
            Console.WriteLine("HTML generated: index.html");
        }
    }
}
